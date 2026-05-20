pipeline {
    agent any

    environment {
        DATABASE_URL = credentials('DATABASE_URL')
        IMAGE_NAME = 'delivery-usuario'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Prisma Generate') {
            steps {
                sh 'npx prisma generate'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t ${IMAGE_NAME}:${BUILD_NUMBER} .'
                sh 'docker tag ${IMAGE_NAME}:${BUILD_NUMBER} ${IMAGE_NAME}:latest'
            }
        }
    }

    post {
        success {
            echo "Build #${BUILD_NUMBER} concluído com sucesso"
        }
        failure {
            echo "Build #${BUILD_NUMBER} falhou"
        }
        always {
            cleanWs()
        }
    }
}
