
# Image contains everything needed for Angular development:
# Node 8, NPM 5.6.0, Chromium Headless, Selenium Webdriver, etc.
FROM trion/ng-cli-e2e:1.7.3

RUN apt-get update -q

ENV PYTHONIOENCODING=UTF-8

# RUN DEBIAN_FRONTEND=noninteractive apt-get install -qy awscli
# RUN pip install awscli

RUN apt-get install -y \
    python \
    python-dev \
    python-pip

RUN pip install awscli

RUN aws --version

WORKDIR /ng-app

COPY . ./

RUN npm set progress=false

RUN npm install

RUN cat /etc/os-release

# Default command which will run unless any other command is given during docker run.
CMD ["/bin/bash"]
