# Nginx deployment

A general guideline for using nginx with certbot in order to provide https access for the apiHub instance.
If you use an EC2 instance, see https://www.nginx.com/blog/using-free-ssltls-certificates-from-lets-encrypt-with-nginx/ .

## Prerequisite
1. Reserved DNS

## Installation

1. Deploy the nginx-service
```shell
kubectl apply -f ./epi/k8s/nginx/nginx-service.yaml
```
2. Configure DNS to point to your nginx endpoint
3. Execute
```shell
kubectl apply -f ./epi/k8s/nginx/nginx-persistent-volume.yaml
kubectl apply -f ./epi/k8s/nginx/nginx-generate-cert.yaml
```
4. Connect to your nginx pod and execute
```shell
apt-get update
apt-get install certbot
apt-get install python3-certbot-nginx
apt-get install nano
nano /etc/nginx/conf.d/**_<your-dns (eg. epi.nvs.dev)>.conf_** with the content from below
certbot --nginx -d <your-dns> and fill the command requirements. If successfull, the pod will restart.
```
Nginx configuration:
```json
    server {
        listen 80 default_server;
        listen [::]:80 default_server;
        root /var/www/html;
        server_name <your-dns>;
    }
```
5. Destroy the nginx pod
```shell
kubectl delete deploy nginx
```
6. Update the file ./epi/k8s/nginx/nginx-configmap.yaml to use your dns ( replace the 'epidemo.pharmaledger.dev' with your own)
7. Execute
```shell
kubectl apply -f ./epi/k8s/nginx/nginx-configmap.yaml
kubectl apply -f ./epi/k8s/nginx/nginx.yaml
```
8. Backup your certificates.

## Renew Certificates

1. Update the nginx deployment
```shell
kubectl apply -f ./epi/k8s/nginx/nginx-generate-cert.yaml -n <your-namespace>
```
2. Restart the nginx deployment
```shell
kubectl rollout restart deploy nginx -n <your-namespace>
```
3. Connect to your nginx pod and execute
```shell
apt-get update
apt-get install certbot
apt-get install python3-certbot-nginx
apt-get install nano
nano /etc/nginx/nginx.conf
```
Update the contents of <i>/etc/nginx/nginx.conf</i> with the one from <i>nginx-configmap.yaml</i>
After the nginx.conf is updated, execute :
```shell
certbot renew --nginx
```
and ignore any errors. Only the log line "Renewing an existing certificate" it is important, the following errors about PID numbers or failure to restart can be ignored.
Executing again the command :
```shell
certbot renew --nginx
```
should produce a similar result :
```shell
Saving debug log to /var/log/letsencrypt/letsencrypt.log

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Processing /etc/letsencrypt/renewal/***.conf
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Cert not yet due for renewal

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

The following certs are not due for renewal yet:
  /etc/letsencrypt/live/***/fullchain.pem expires on *** (skipped)
No renewals were attempted.
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

```
4. Update the nginx deployment
```shell
kubectl apply -f ./epi/k8s/nginx/nginx.yaml -n <your-namespace>
```
5. Restart the nginx deployment
```shell
kubectl rollout restart deploy nginx -n <your-namespace>
```
