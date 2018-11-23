# WTT 

## Build 
```
 sudo docker build -t wtt-noti:{ version } .
```
 ## Run 
```
 sudo docker run --rm -p { port }:8080 --env NODE_ENV={ env } wtt-noti:{version}
 ```
 ## Create tag
 ```
 sudo docker tag wtt-noti:{ version } tuannq(repo)/wtt(group)/wtt-noti:{ version }
 ```
 ## Push tag
 ```
 sudo docker push tuannq(repo)/wtt(group)/wtt-noti:{ version }
 ```
 ## Pull tag
 ```
 sudo docker pull tuannq(repo)/wtt(group)/wtt-noti:{ version }
 ```
 ## View image 
 ```
 sudo docker image ls
 ```
 ## View container
 ```
 sudo docker container ls
 ```
 ## Stop
 ```
 sudo docker stop {container_id}
 ```
 ## Remove image
 ```
  sudo docker rmi {image_id}
 ```