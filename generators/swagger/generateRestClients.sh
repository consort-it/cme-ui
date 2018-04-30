#!/bin/bash

echo NOTE: java needs to be in your PATH.


cd "$(dirname "$0")"


#source yaml files for the generator, must match TARGET_LIB_FOLDERS
SOURCE_YAMLS=(
  "git@gitlab.consort-it.de:cme2/metadata-service.git HEAD swagger.yaml"
  "git@gitlab.consort-it.de:cme2/kubernetes-adapter HEAD swagger.yaml"
  "git@gitlab.consort-it.de:cme2/aws-costs-adapter HEAD swagger.yaml"
  "git@gitlab.consort-it.de:cme2/cloudwatch-logs-adapter HEAD swagger.yaml"
  "git@gitlab.consort-it.de:cme2/jira-adapter HEAD swagger.yaml"
  "git@gitlab.consort-it.de:cme2/quality-adapter HEAD swagger.yaml"
  "git@gitlab.consort-it.de:cme2/gitlab-adapter HEAD swagger.yaml"
)

# output folders for generated code, must match SOURCE_YAMLS
TARGET_LIB_FOLDERS=(
  "../../libs/connector-metadata/src/"
  "../../libs/connector-kubernetes/src/"
  "../../libs/connector-aws-costs/src/"
  "../../libs/connector-cloudwatch-logs/src/"
  "../../libs/connector-jira/src/"
  "../../libs/connector-quality/src/"
  "../../libs/connector-gitlab/src/"
)

LEN=${#SOURCE_YAMLS[@]};

if [ ! $LEN == ${#TARGET_LIB_FOLDERS[@]} ]
then
  echo SOURCE_YAMLS length must match TARGET_LIB_FOLDERS
  exit 1
fi

for (( i=0; i<${LEN}; i++ ))
do
  SOURCE=${SOURCE_YAMLS[$i]}
  SOURCE_DIR=`dirname $SOURCE`
  OUTPUT=${TARGET_LIB_FOLDERS[$i]}

  if [[ ! $OUTPUT == */src/ ]]
  then
    echo "Output folder must be the /src folder of the angular lib: $OUTPUT"
    exit 1
  fi

  echo .
  echo ======== Generating client for $SOURCE =========
  echo Pulling swagger file from newest master version
  echo .
  if [ -f "temp-swagger.yaml" ]
  then
    rm temp-swagger.yaml
  fi
  git archive --remote=$SOURCE | tar -x
  mv *.yaml temp-swagger.yaml
  if [ ! -f "temp-swagger.yaml" ]
  then
    echo "Could not find $SOURCE"
    exit 1
  fi
  echo .
  echo Deleting old content of $OUTPUT
  echo .
  rm -rf $OUTPUT/*
  echo Generating files
  echo .
  java -jar swagger-codegen-cli.jar generate -l typescript-angular -t typescript-angular-cme/ -i temp-swagger.yaml -o $OUTPUT
  rm temp-swagger.yaml
  echo .
  echo /======= Finished client for $SOURCE ===========
done
