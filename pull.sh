#! /bin/bash

ssh-agent bash -c 'ssh-add /home/hackerman/.ssh/id_rsa.pub; git pull git@git.uark.edu:ejmason/FayJones_LRS.git'
