pipeline {
    agent {
        docker {
            image 'node:10.17.0-alpine' 
            args '-p 3000:3000' 
        }
    }
    stages {
        stage('Build') { 
            steps {
                sh 'npm install'
                sh 'npm install gulp --save-dev'
                sh 'gulp init'
                sh 'gulp package' 
            }
        }
    }
}