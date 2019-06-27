while [ 1 ]
do
  result=`pgrep -f testservice.py | wc -l`
  if [ $result -ge 1 ]
  then
    echo "runnning"
  else
    echo "not running"
    python3 ~/book/ch06/service/testservice.py &
  fi
  sleep 1s
done
