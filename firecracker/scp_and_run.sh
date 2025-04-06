scp -i ~/.ssh/root ../devops/balancer root@49.12.131.229:
scp -i ~/.ssh/root setup.sh root@49.12.131.229:
ssh -v -i ~/.ssh/root root@49.12.131.229 "bash setup.sh"
