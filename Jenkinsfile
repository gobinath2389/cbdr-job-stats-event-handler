node('Mando') { 
    stage('Checkout') {
      checkoutRepo('cbdr', 'job-stats-event-handler')
    }
    stage('Build') {
        sh '''#!/bin/bash -l
            `bash acreds.sh arn:aws:iam::155931747413:role/JenkinsIAM`
            rm -rf node_modules
            nvm install 16.17.0
            nvm use 16.17.0
            npm install
          '''
    }
    stage('Test') {
        sh '''#!/bin/bash -l
           nvm use 16.17.0
           npm run test:ci
         '''
    }
    
    stage('Deploy') {
      if (env.BRANCH_NAME == 'dev') {
        build job: 'Mando/JobStatsEventHandler/Stage/Deploy'
      }
      if (env.BRANCH_NAME == 'master') {
          build job: 'Mando/JobStatsEventHandler/ProductionUS/Deploy'
      }
      else {
        println 'Not on dev or master branch: ${env.BRANCH_NAME}, skipping deployment'
      }
    }
}