  rm -rf fc
  dnf install epel-release -y
  dnf install htop tar iptables-services -y
  mkdir fc
  cd fc
  wget https://github.com/firecracker-microvm/firecracker/releases/download/v1.11.0/firecracker-v1.11.0-x86_64.tgz
  gunzip firecracker-v1.11.0-x86_64.tgz
  tar -xf firecracker-v1.11.0-x86_64.tar
  cd release-v1.11.0-x86_64

  cp firecracker-v1.11.0-x86_64 /usr/local/bin/firecracker
  cp jailer-v1.11.0-x86_64 /usr/local/bin/jailer
  cd ..
  setfacl -m u:${USER}:rw /dev/kvm
  [ $(stat -c "%G" /dev/kvm) = kvm ] && usermod -aG kvm ${USER} && echo "Access granted."
  [ -r /dev/kvm ] && [ -w /dev/kvm ] && echo "OK" || echo "FAIL"
  ARCH="x86_64"
  CI_VERSION="v1.11.0"
  wget "https://s3.amazonaws.com/spec.ccfc.min/firecracker-ci/v1.11/x86_64/vmlinux-6.1.102"

  latest_ubuntu_key="firecracker-ci/v1.11/x86_64/ubuntu-24.04.squashfs"
  ubuntu_version="24.04"
  wget -O ubuntu-$ubuntu_version.squashfs.upstream "https://s3.amazonaws.com/spec.ccfc.min/$latest_ubuntu_key"
  unsquashfs ubuntu-$ubuntu_version.squashfs.upstream
  ssh-keygen -f id_rsa -N ""
  cp -v id_rsa.pub squashfs-root/root/.ssh/authorized_keys
  mv -v id_rsa ubuntu-$ubuntu_version.id_rsa
  chown -R root:root squashfs-root
  truncate -s 200G ubuntu-$ubuntu_version.ext4
  mkfs.ext4 -d squashfs-root -F ubuntu-$ubuntu_version.ext4
  useradd -r -s /bin/false fc_user
cat > run_jailer.sh << EOF
#!/bin/bash
set -e

JAIL_ID="hello-fc"
JAIL_ROOT="/srv/jailer/firecracker/hello-fc/root"
ROOTFS_NAME="ubuntu-24.04.ext4"
KERNEL_NAME="vmlinux-6.1.102"
FC_USER="fc_user"
ROOTFS_SOURCE="/root/fc/ubuntu-24.04.ext4"
KERNEL_SOURCE="/root/fc/vmlinux-6.1.102"

if [ -d "/srv/jailer/firecracker/hello-fc/root/rootfs" ] && [ -f "/srv/jailer/firecracker/hello-fc/root/rootfs/ubuntu-24.04.ext4" ]; then
  cp /srv/jailer/firecracker/hello-fc/root/rootfs/ubuntu-24.04.ext4 /root/fc-rootfs-save
fi

rm -rf /srv/jailer/firecracker
mkdir -p "/srv/jailer/firecracker/hello-fc/root/rootfs"

if [ -s /root/fc-rootfs-save ]; then
  mv /root/fc-rootfs-save /srv/jailer/firecracker/hello-fc/root/rootfs/ubuntu-24.04.ext4
  echo "Restored previous rootfs image"
else
  cp /root/fc/ubuntu-24.04.ext4 /srv/jailer/firecracker/hello-fc/root/rootfs/
  echo "Copied fresh rootfs image"
fi

cp /root/fc/vmlinux-6.1.102 /srv/jailer/firecracker/hello-fc/root/
chown -R ":" /srv/jailer/firecracker/hello-fc/root/rootfs
exec /usr/local/bin/jailer --id "hello-fc" --uid "0" --gid "0" --chroot-base-dir /srv/jailer --exec-file /usr/local/bin/firecracker -- --api-sock /run/api.sock
EOF
cat > /etc/systemd/system/balancer.service << EOF
[Unit]
Description=Balancer
After=network.target
Requires=network.target

[Service]
Type=simple
User=root
Group=root
ExecStart=/root/balancer
CapabilityBoundingSet=CAP_NET_BIND_SERVICE CAP_DAC_OVERRIDE CAP_CHOWN CAP_SETUID CAP_SETGID
AmbientCapabilities=CAP_NET_BIND_SERVICE CAP_DAC_OVERRIDE CAP_CHOWN CAP_SETUID CAP_SETGID
#StandardOutput=null
#StandardError=null

Restart=on-failure
RestartSec=5s

LimitNOFILE=1048576
LimitMEMLOCK=infinity

KillMode=mixed
KillSignal=SIGTERM
TimeoutStopSec=10

[Install]
WantedBy=multi-user.target
EOF
cat > /etc/systemd/system/fcjail.service << EOF
[Unit]
Description=Firecracker Jailer Service
After=network.target
Requires=network.target

[Service]
Type=simple
User=root
Group=root
ExecStart=/root/fc/run_jailer.sh
ExecStartPost=/bin/bash -c "sleep 3 && /root/fc/run_curls.sh"
CapabilityBoundingSet=CAP_SYS_ADMIN CAP_MKNOD CAP_DAC_OVERRIDE CAP_CHOWN CAP_SETUID CAP_SETGID
AmbientCapabilities=CAP_SYS_ADMIN CAP_MKNOD CAP_DAC_OVERRIDE CAP_CHOWN CAP_SETUID CAP_SETGID
SecureBits=keep-caps
PrivateMounts=no
#StandardOutput=null
#StandardError=null

Restart=on-failure
RestartSec=5s

LimitNOFILE=1048576
LimitMEMLOCK=infinity

KillMode=mixed
KillSignal=SIGTERM
TimeoutStopSec=10

[Install]
WantedBy=multi-user.target
EOF
  chmod +x run_jailer.sh
  chmod 644 /etc/systemd/system/fcjail.service
  systemctl daemon-reload
  systemctl enable fcjail.service
  systemctl enable balancer
  systemctl start balancer

TAP_DEV="tap0"
TAP_IP="172.16.0.1"
MASK_SHORT="/30"
HOST_IFACE="enp0s31f6"

systemctl stop iptables

# Remove existing tap interface
ip link del "$TAP_DEV" 2>/dev/null || true

# Create tap interface
ip tuntap add dev "$TAP_DEV" mode tap
ip addr add "${TAP_IP}${MASK_SHORT}" dev "$TAP_DEV"
ip link set dev "$TAP_DEV" up

# Enable IP forwarding
echo 1 > /proc/sys/net/ipv4/ip_forward

# Flush existing rules
iptables -F
iptables -t nat -F
iptables -t mangle -F
iptables -X

# Set default policies (INPUT defaults to ACCEPT but last rule REJECTs)
iptables -P INPUT ACCEPT
iptables -P FORWARD DROP  # Changed to DROP for security
iptables -P OUTPUT ACCEPT

# INPUT chain rules
iptables -A INPUT -m state --state RELATED,ESTABLISHED -j ACCEPT
iptables -A INPUT -p icmp -j ACCEPT
iptables -A INPUT -i lo -j ACCEPT
# Allow SSH only on the host's main interface
iptables -A INPUT -i "$HOST_IFACE" -p tcp --dport 22 -m state --state NEW -j ACCEPT
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j ACCEPT
iptables -A INPUT -j REJECT --reject-with icmp-host-prohibited

# FORWARD chain rules
iptables -A FORWARD -m state --state RELATED,ESTABLISHED -j ACCEPT
# Allow VMs to reach the internet
iptables -A FORWARD -i "$TAP_DEV" -o "$HOST_IFACE" -j ACCEPT
# Allow incoming SSH traffic to VMs after DNAT
iptables -A FORWARD -i "$HOST_IFACE" -o "$TAP_DEV" -d 172.16.0.2/32 -p tcp --dport 22 -j ACCEPT
iptables -A FORWARD -i "$HOST_IFACE" -o "$TAP_DEV" -d 172.16.0.3/32 -p tcp --dport 22 -j ACCEPT

# NAT rules
iptables -t nat -A PREROUTING -p tcp --dport 2201 -j DNAT --to-destination 172.16.0.2:22
iptables -t nat -A PREROUTING -p tcp --dport 2202 -j DNAT --to-destination 172.16.0.3:22
iptables -t nat -A POSTROUTING -s 172.16.0.0/30 -o "$HOST_IFACE" -j MASQUERADE

# Save rules
iptables-save > /etc/sysconfig/iptables

systemctl enable iptables --now






cat > run_curls.sh << EOF
  JAIL_ROOT="/srv/jailer/firecracker/hello-fc/root"
  API_SOCKET="\${JAIL_ROOT}/run/api.sock"
  curl -i -X PUT --unix-socket "\${API_SOCKET}" --data '{ "kernel_image_path": "vmlinux-6.1.102", "boot_args": "console=ttyS0 reboot=k panic=1 pci=off" }' "http://localhost/boot-source"
  curl -i -X PUT --unix-socket "\${API_SOCKET}" --data '{ "drive_id": "rootfs", "path_on_host": "/rootfs/ubuntu-24.04.ext4", "is_root_device": true, "is_read_only": false }' "http://localhost/drives/rootfs"
  curl -i -X PUT --unix-socket "\${API_SOCKET}" --data '{ "iface_id": "net1", "guest_mac": "06:00:AC:10:00:02", "host_dev_name": "tap0" }' "http://localhost/network-interfaces/net1"
  curl -i -X PUT --unix-socket "\${API_SOCKET}" --data '{"vcpu_count": 2, "mem_size_mib": 32768, "smt": false}' "http://localhost/machine-config"
  sleep 0.015s
  curl -i -X PUT --unix-socket "\${API_SOCKET}" --data '{"action_type": "InstanceStart"}' "http://localhost/actions"
  sleep 2s
  KEY_NAME=/root/fc/ubuntu-24.04.id_rsa
  ssh -i \$KEY_NAME root@172.16.0.2  "ip route add default via 172.16.0.1 dev eth0"
  ssh -i \$KEY_NAME root@172.16.0.2  "echo 'nameserver 8.8.8.8' > /etc/resolv.conf"
  exit 0
EOF
  chmod +x run_curls.sh
  systemctl start fcjail.service
