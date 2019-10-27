pipeline {
    agent {
        docker {
            image 'node:10.17.0-alpine' 
            args '-p 3000:3000' 
        }
    }
    environment {
        CI = 'true' 
    }
    stages {
        stage('Build') { 
            steps {
                sh 'mkdir ~/.npm-global'
                sh 'npm config set prefix "~/.npm-global"'
                sh 'export PATH=~/.npm-global/bin:$PATH'
                sh 'source ~/.profile'

                sh 'npm install'
                sh 'npm install -g gulp --save-dev'
                sh 'gulp init'
                sh 'gulp package' 
            }
        }
    }
}