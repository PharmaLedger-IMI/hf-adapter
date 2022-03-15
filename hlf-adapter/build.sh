aws ecr-public get-login-password --region us-east-1 | docker login --username AWS --password-stdin public.ecr.aws/n4q1q0z2
docker build --no-cache -t public.ecr.aws/n4q1q0z2/hf:hf-adapter.0.24 -f dockerfile .
docker push public.ecr.aws/n4q1q0z2/hf:hf-adapter.0.24

