Random rand = new Random()
xvfbRand = rand.nextInt(1000)

pipeline {
    agent { label 'tests' }

    stages {
        stage('Test') {
            steps {
                script {
                    def xvfbNum = xvfbRand
                    wrap([$class: 'Xvfb', debug: true, displayNameOffset: xvfbNum, additionalOptions: '-ac', screen: '1280x1024x24']) {
                        try {
                            retry (2) {
                                timeout(time: 30, unit: 'MINUTES') {
                                    sh """
                                        yarn --frozen-lockfile
                                        ./node_modules/bower/bin/bower install
                                        ./node_modules/ember-cli/bin/ember t
                                    """
                                }
                            }
                        } catch (e) {
                            echo e.toString()
                            echo e.getStackTrace().toString()
                            currentBuild.result = 'FAILURE'
                            // Rethrow error after logging failure, the finally clause will still run
                            throw e
                        } finally {
                            // Indicate that job reached test body successfully
                            sh """
                                if [ ! -f test-results.xml ]; then
                                    echo "<testsuites />" > test-results.xml
                                fi
                            """

                            try {
                                junit allowEmptyResults: true, testResults: '**/test-results.xml'
                            } catch(e) {
                                echo e.toString()
                                echo e.getStackTrace().toString()
                                currentBuild.result = 'UNSTABLE'
                            }

                            archiveArtifacts allowEmptyArchive: true, artifacts: '**/test-results.xml, **/testlogs/*.lcov', excludes: null
                        }
                    }
                }
            }
        }
    }
}
