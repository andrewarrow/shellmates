# First, rename your current files for clarity
mv /root/fc/run_jailer.sh /root/fc/run_jailer_vm1.sh
mv /root/fc/run_curls.sh /root/fc/run_curls_vm1.sh

# Create the second VM's jailer script
cat > /root/fc/run_jailer_vm2.sh << 'EOF'
#!/bin/bash
set -e

JAIL_ID="vm2"
JAIL_ROOT="/srv/jailer/firecracker/vm2/root"
ROOTFS_NAME="ubuntu-24.04.ext4"
KERNEL_NAME="vmlinux-6.1.102"
FC_USER="fc_user"
ROOTFS_SOURCE="/root/fc/ubuntu-24.04.ext4"
KERNEL_SOURCE="/root/fc/vmlinux-6.1.102"

if [ -d "/srv/jailer/firecracker/vm2/root/rootfs" ] && [ -f "/srv/jailer/firecracker/vm2/root/rootfs/ubuntu-24.04.ext4" ]; then
  cp /srv/jailer/firecracker/vm2/root/rootfs/ubuntu-24.04.ext4 /root/fc-rootfs-vm2-save
fi

rm -rf /srv/jailer/firecracker/vm2
mkdir -p "/srv/jailer/firecracker/vm2/root/rootfs"

if [ -s /root/fc-rootfs-vm2-save ]; then
  mv /root/fc-rootfs-vm2-save /srv/jailer/firecracker/vm2/root/rootfs/ubuntu-24.04.ext4
  echo "Restored previous rootfs image for VM2"
else
  cp /root/fc/ubuntu-24.04.ext4 /srv/jailer/firecracker/vm2/root/rootfs/
  echo "Copied fresh rootfs image for VM2"
fi

cp /root/fc/vmlinux-6.1.102 /srv/jailer/firecracker/vm2/root/
chown -R ":" /srv/jailer/firecracker/vm2/root/rootfs
exec /usr/local/bin/jailer --id "vm2" --uid "0" --gid "0" --chroot-base-dir /srv/jailer --exec-file /usr/local/bin/firecracker -- --api-sock /run/api.sock
EOF

# Create the second VM's curl configuration script
cat > /root/fc/run_curls_vm2.sh << 'EOF'
#!/bin/bash
JAIL_ROOT="/srv/jailer/firecracker/vm2/root"
API_SOCKET="${JAIL_ROOT}/run/api.sock"
curl -i -X PUT --unix-socket "${API_SOCKET}" --data '{ "kernel_image_path": "vmlinux-6.1.102", "boot_args": "console=ttyS0 reboot=k panic=1 pci=off" }' "http://localhost/boot-source"
curl -i -X PUT --unix-socket "${API_SOCKET}" --data '{ "drive_id": "rootfs", "path_on_host": "/rootfs/ubuntu-24.04.ext4", "is_root_device": true, "is_read_only": false }' "http://localhost/drives/rootfs"
curl -i -X PUT --unix-socket "${API_SOCKET}" --data '{ "iface_id": "net1", "guest_mac": "06:00:AC:10:00:03", "host_dev_name": "tap0" }' "http://localhost/network-interfaces/net1"
curl -i -X PUT --unix-socket "${API_SOCKET}" --data '{"vcpu_count": 2, "mem_size_mib": 32768, "smt": false}' "http://localhost/machine-config"
sleep 0.015s
curl -i -X PUT --unix-socket "${API_SOCKET}" --data '{"action_type": "InstanceStart"}' "http://localhost/actions"
sleep 2s
KEY_NAME=/root/fc/ubuntu-24.04.id_rsa
ssh -i $KEY_NAME root@172.16.0.3 "ip route add default via 172.16.0.1 dev eth0"
ssh -i $KEY_NAME root@172.16.0.3 "echo 'nameserver 8.8.8.8' > /etc/resolv.conf"
exit 0
EOF

# Now also update the first VM's scripts to use the new "vm1" naming
cat > /root/fc/run_jailer_vm1.sh << 'EOF'
#!/bin/bash
set -e

JAIL_ID="vm1"
JAIL_ROOT="/srv/jailer/firecracker/vm1/root"
ROOTFS_NAME="ubuntu-24.04.ext4"
KERNEL_NAME="vmlinux-6.1.102"
FC_USER="fc_user"
ROOTFS_SOURCE="/root/fc/ubuntu-24.04.ext4"
KERNEL_SOURCE="/root/fc/vmlinux-6.1.102"

if [ -d "/srv/jailer/firecracker/vm1/root/rootfs" ] && [ -f "/srv/jailer/firecracker/vm1/root/rootfs/ubuntu-24.04.ext4" ]; then
  cp /srv/jailer/firecracker/vm1/root/rootfs/ubuntu-24.04.ext4 /root/fc-rootfs-vm1-save
fi

rm -rf /srv/jailer/firecracker/vm1
mkdir -p "/srv/jailer/firecracker/vm1/root/rootfs"

if [ -s /root/fc-rootfs-vm1-save ]; then
  mv /root/fc-rootfs-vm1-save /srv/jailer/firecracker/vm1/root/rootfs/ubuntu-24.04.ext4
  echo "Restored previous rootfs image for VM1"
else
  cp /root/fc/ubuntu-24.04.ext4 /srv/jailer/firecracker/vm1/root/rootfs/
  echo "Copied fresh rootfs image for VM1"
fi

cp /root/fc/vmlinux-6.1.102 /srv/jailer/firecracker/vm1/root/
chown -R ":" /srv/jailer/firecracker/vm1/root/rootfs
exec /usr/local/bin/jailer --id "vm1" --uid "0" --gid "0" --chroot-base-dir /srv/jailer --exec-file /usr/local/bin/firecracker -- --api-sock /run/api.sock
EOF

# Update the first VM's curl script
cat > /root/fc/run_curls_vm1.sh << 'EOF'
#!/bin/bash
JAIL_ROOT="/srv/jailer/firecracker/vm1/root"
API_SOCKET="${JAIL_ROOT}/run/api.sock"
curl -i -X PUT --unix-socket "${API_SOCKET}" --data '{ "kernel_image_path": "vmlinux-6.1.102", "boot_args": "console=ttyS0 reboot=k panic=1 pci=off" }' "http://localhost/boot-source"
curl -i -X PUT --unix-socket "${API_SOCKET}" --data '{ "drive_id": "rootfs", "path_on_host": "/rootfs/ubuntu-24.04.ext4", "is_root_device": true, "is_read_only": false }' "http://localhost/drives/rootfs"
curl -i -X PUT --unix-socket "${API_SOCKET}" --data '{ "iface_id": "net1", "guest_mac": "06:00:AC:10:00:02", "host_dev_name": "tap0" }' "http://localhost/network-interfaces/net1"
curl -i -X PUT --unix-socket "${API_SOCKET}" --data '{"vcpu_count": 2, "mem_size_mib": 32768, "smt": false}' "http://localhost/machine-config"
sleep 0.015s
curl -i -X PUT --unix-socket "${API_SOCKET}" --data '{"action_type": "InstanceStart"}' "http://localhost/actions"
sleep 2s
KEY_NAME=/root/fc/ubuntu-24.04.id_rsa
ssh -i $KEY_NAME root@172.16.0.2 "ip route add default via 172.16.0.1 dev eth0"
ssh -i $KEY_NAME root@172.16.0.2 "echo 'nameserver 8.8.8.8' > /etc/resolv.conf"
exit 0
EOF

# Make both scripts executable
chmod +x /root/fc/run_jailer_vm1.sh
chmod +x /root/fc/run_curls_vm1.sh
chmod +x /root/fc/run_jailer_vm2.sh
chmod +x /root/fc/run_curls_vm2.sh

# Create the systemd service files for both VMs
cat > /etc/systemd/system/fcjail1.service << 'EOF'
[Unit]
Description=Firecracker Jailer VM1 Service
After=network.target
Requires=network.target

[Service]
Type=simple
User=root
Group=root
ExecStart=/root/fc/run_jailer_vm1.sh
ExecStartPost=/bin/bash -c "sleep 3 && /root/fc/run_curls_vm1.sh"
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

cat > /etc/systemd/system/fcjail2.service << 'EOF'
[Unit]
Description=Firecracker Jailer VM2 Service
After=network.target fcjail1.service
Requires=network.target
Wants=fcjail1.service

[Service]
Type=simple
User=root
Group=root
ExecStart=/root/fc/run_jailer_vm2.sh
ExecStartPost=/bin/bash -c "sleep 3 && /root/fc/run_curls_vm2.sh"
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

# Disable the original service and enable the new ones
systemctl disable fcjail.service
systemctl enable fcjail1.service
systemctl enable fcjail2.service

# Run these commands to start the services
# systemctl start fcjail1.service
# sleep 10  # Give VM1 time to start
# systemctl start fcjail2.service

echo "Configuration complete. Use the following commands to start your VMs:"
echo "systemctl start fcjail1.service"
echo "sleep 10  # Give VM1 time to fully initialize"
echo "systemctl start fcjail2.service"
