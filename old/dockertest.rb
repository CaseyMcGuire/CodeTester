require 'docker'


container = Docker::Container.create('Cmd' => ['ls'], 'Image' => 'ubuntu:latest')
puts container.json
container.kill
container.delete
