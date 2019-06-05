#!/usr/bin/env bash

echo "1/4 Login Aws"
$(aws ecr get-login --no-include-email --region us-west-2 --profile franager)
# Invalidate cache on CloudFront
echo "2/4 Build Docker"
docker build -t franager .
echo "3/4 Build Docker"
docker tag franager:latest 563025344612.dkr.ecr.us-west-2.amazonaws.com/franager:latest
# in case you need to login use this
# aws ecr get-login --no-include-email --profile franager
echo "4/4 Build Docker"
docker push 563025344612.dkr.ecr.us-west-2.amazonaws.com/franager:latest
