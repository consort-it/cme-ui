#!groovy

NAME='cme-ui'
REGISTRY='consortit-docker-cme-local.jfrog.io'
DOCKER_IMAGE="$REGISTRY/$NAME:latest"
BRANCH_NAME=env.BRANCH_NAME

node('master') {

    // disable concurrent builds on the same node
    properties([disableConcurrentBuilds()])

    currentBuild.result = "SUCCESS"

    try {
      stage('cleanUp') {

        sh "ssh jenkins.consort-it.de 'docker ps -a -q -f ancestor=\"${REGISTRY}/${NAME}\" -f status=exited | xargs --no-run-if-empty docker rm'"
        
      }

      stage('checkout') {

        deleteDir()

        checkout([$class: 'GitSCM', branches: [[name: "*/${BRANCH_NAME}"]], doGenerateSubmoduleConfigurations: false, extensions: [[$class: 'RelativeTargetDirectory', relativeTargetDir: 'cme-ui']], submoduleCfg: [], userRemoteConfigs: [[credentialsId: '2e705f31-c6c1-4e5d-8568-49c1562dccbe', url: 'git@gitlab.consort-it.de:cme2/cme-ui.git']]])

        sh "tar -cjpvf ${NAME}.tar.bz2 --exclude=.git ${NAME}/."

        sh "ssh jenkins.consort-it.de 'rm -Rf ${NAME}.tar.bz2 ${NAME}'"

        sh "scp ${NAME}.tar.bz2 jenkins.consort-it.de:~"

        sh "ssh jenkins.consort-it.de 'tar xjvf ${NAME}.tar.bz2 && chmod 777 ${NAME}'"
      }

      stage('build image') {

        sh "ssh jenkins.consort-it.de 'cd ${NAME} && sh build.sh'"

        sh "ssh jenkins.consort-it.de 'tar -cjpvf ${NAME}.tar.bz2 ${NAME}/.'"

        sh "scp jenkins.consort-it.de:~/${NAME}.tar.bz2 ."

        sh "tar -xjvf ${NAME}.tar.bz2"

      }

      stage('lint') {

        sh "ssh jenkins.consort-it.de 'docker run ${DOCKER_IMAGE} npm run lint'"

      }

      stage('test') {

        sh "ssh jenkins.consort-it.de 'docker run -v `pwd`/${NAME}/testresult:/ng-app/testresult ${DOCKER_IMAGE} bash -c \"ng test --single-run --reporters=junit; chmod -R 777 /ng-app/testresult\"'"

  	    sh "ssh jenkins.consort-it.de 'tar -cjpvf ${NAME}.tar.bz2 ${NAME}/.'"

        sh "scp jenkins.consort-it.de:~/${NAME}.tar.bz2 ."

        sh "tar -xjvf ${NAME}.tar.bz2"

        sh "ssh jenkins.consort-it.de 'docker run ${DOCKER_IMAGE} npm run test:pact'"

        sh "ssh jenkins.consort-it.de 'docker run ${DOCKER_IMAGE} npm run e2e'"

      }

      if(env.BRANCH_NAME == 'master') {

        stage('Sonar Analysis') {
           withCredentials([string(credentialsId: 'sonarqube-token', variable: 'TOKEN')]) {
              sh "ssh jenkins.consort-it.de 'docker run ${DOCKER_IMAGE} bash -c \"npm run test:coverage && ./node_modules/.bin/sonar-scanner -Dsonar.projectVersion=${BUILD_NUMBER} -Dsonar.host.url=https://cme.dev.k8s.consort-it.de/sonar/ -Dsonar.login=$TOKEN\"'"
           }
        }

        stage('build and deployToS3') {

	        sh 'PATH=/var/jenkins_home/bin:/var/jenkins_home/.local/bin:$PATH aws sts get-session-token > sts.json'
	        sh 'python cme-ui/loadsts.py'
          sh "scp aws.env jenkins.consort-it.de:aws.env"

          parallel(
              "buid-cme-ui": {
                sh "ssh jenkins.consort-it.de 'docker run --env-file aws.env ${DOCKER_IMAGE} bash -c \"npm run updateBuild -- ${BUILD_NUMBER} && npm run build:prod && aws --version && aws s3 rm s3://cme-ui.dev.consort-it.de --recursive --region eu-central-1 && aws s3 cp dist/apps/cme-ui s3://cme-ui.dev.consort-it.de --region eu-central-1 --recursive --acl public-read && aws s3 cp dist/apps/cme-ui/index.html s3://cme-ui.dev.consort-it.de --region eu-central-1 --cache-control max-age=60 --acl public-read\"'"
              },
              "build-showcase": {
                sh "ssh jenkins.consort-it.de 'docker run ${DOCKER_IMAGE} npm run build-showcase:prod'"
              }
          ) 
        }
      } else {
        stage('build') {

          parallel(
              "buid-cme-ui": {
                sh "ssh jenkins.consort-it.de 'docker run ${DOCKER_IMAGE} npm run build:prod'"
              },
              "build-showcase": {
                sh "ssh jenkins.consort-it.de 'docker run ${DOCKER_IMAGE} npm run build-showcase:prod'"
              }
          ) 
        }
      }

    archiveArtifacts allowEmptyArchive: true, artifacts: "${NAME}/testresult/**/*.*"
    junit testResults: "${NAME}/testresult/**/TESTS-*.xml", allowEmptyResults: true
    }

    catch (err) {

      currentBuild.result = "FAILURE"

      // mail body: "${env.BUILD_URL}",
      //      from: 'jenkins@consort-it.de',
      //      replyTo: 'jenkins@consort-it.de',
      //      subject: "${NAME} pipeline FAILED",
      //      to: 'dev@consort-it.de'

      throw err

    }

}
