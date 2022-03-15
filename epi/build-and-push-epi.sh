cd epi || exit  0

echo ''
echo 'Download epi docker file'
echo''
curl -OL https://raw.githubusercontent.com/PharmaLedger-IMI/epi-workspace/master/docker/Dockerfile
aws ecr-public get-login-password --region us-east-1 | docker login --username AWS --password-stdin public.ecr.aws/n4q1q0z2
docker build --no-cache -t public.ecr.aws/n4q1q0z2/hf:epi.1.1 -f Dockerfile .
docker push public.ecr.aws/n4q1q0z2/hf:epi.1.1
