require 'docker'

puts Docker.validate_version!

puts "Docker.version"
puts Docker.version

puts "Docker.info"
puts Docker.info

puts Docker::Image.all
image = Docker::Image.create('fromImage' => 'ubuntu:latest')

image.insert_local('localPath' => ['test.py'], 'outputPath' => '/')
puts 'image'
puts image.json

puts '--------------'
puts image.id
puts '--------------'
container = Docker::Container.create('Cmd' => ['ls'], 'Image' => image.id)
puts '--------------------'
puts 'container.json'
puts container.json
puts '---------------'
puts 'lets start our container'
container.start
puts '============'
puts container.exec('ls')
puts '============'

container.kill(:signal => "SIGHUP")
image.remove(:force => true)
