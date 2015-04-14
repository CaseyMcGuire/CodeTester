#Source: https://github.com/docker/docker/issues/1905
#!/bin/bash
set -e

to=$1
shift

cont=$(docker run -d "$@")
echo 'cont'
echo $cont
code=$(timeout "$to" docker wait "$cont" || true)
echo 'code'
echo $code
docker kill $cont &> /dev/null
echo -n 'status: '
if [ -z "$code" ]; then
    echo timeout
else
    echo exited: $code
fi

echo output:
# pipe to sed simply for pretty nice indentation
docker logs $cont | sed 's/^/\t/'

docker rm $cont &> /dev/null
