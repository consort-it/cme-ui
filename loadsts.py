import json
import os
import sys

data = json.load(open('sts.json'))

file = open("aws.env","w") 

file.write("AWS_ACCESS_KEY_ID=" + data["Credentials"]["AccessKeyId"] + "\n")
file.write("AWS_SECRET_ACCESS_KEY=" + data["Credentials"]["SecretAccessKey"] + "\n")
file.write("AWS_SESSION_TOKEN=" + data["Credentials"]["SessionToken"] + "\n")
file.close()
