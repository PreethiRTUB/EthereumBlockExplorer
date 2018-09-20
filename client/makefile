FRONTEND=10.200.2.70

deploy: scp-files restart

monitor:
	ssh -i ops

npm-install:
	ssh -i ops

restart:
	ssh -i ops

scp-files:
	scp -r -i ops

swagger:
	bootprint openapi ops/swagger.yaml ops/scripts/swagger

test-production:
	npm run build
	echo "FROM kyma/docker-nginx\nCOPY dist/ /var/www\nCMD 'nginx'" > Dockerfile
	docker build -t ETHBLOCKEXP .
	rm Dockerfile
	docker run -p -d 80:80 ETHBLOCKEXP
