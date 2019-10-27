pipeline {
    agent {
        docker {
            image 'node:lts-alpine'
            args '-u root --privileged'
        }
    }
    environment {
        CI = 'true' 
    }
    stages {
        stage('Build') { 
            steps {
                sh 'npm install'
                sh 'npm install -g gulp --save-dev'
                sh 'gulp init'
                sh 'gulp package' 
            }
        }
    }
}