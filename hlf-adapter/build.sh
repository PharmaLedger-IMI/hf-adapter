aws ecr-public get-login-password --region us-east-1 | docker login --username AWS --password-stdin public.ecr.aws/n4q1q0z2
docker build -t public.ecr.aws/n4q1q0z2/iot:app.0.1 -f dockerfile .
docker push public.ecr.aws/n4q1q0z2/iot:app.0.1

