FROM ubuntu:latest

RUN apt-get update

RUN apt-get install -y gcc
RUN apt-get install -y g++
RUN apt-get install -y ruby
RUN apt-get install -y python
RUN apt-get install -y npm
RUN apt-get install -y golang-go
RUN apt-get install -y nodejs
RUN apt-get install -y ghc
RUN apt-get install -y ocaml
RUN apt-get install -y default-jdk

# Install Clojure (well, install Leiningen)
RUN curl https://raw.githubusercontent.com/technomancy/leiningen/stable/bin/lein > /usr/bin/lein
RUN chmod a+x /usr/bin/lein
RUN mkdir ~/.lein
RUN echo '{:user {\
:dependencies [\
  [org.clojure/clojure "1.6.0"] \
  [cheshire "5.3.1"] \   
  [korma "0.3.0"] \
  [com.h2database/h2 "1.3.170"] \
  [org.xerial/sqlite-jdbc "3.7.15-M1"] \
  [com.novemberain/monger "2.0.0"] \
  [com.taoensso/carmine "2.7.0" :exclusions [org.clojure/clojure]] \
  [org.clojure/core.async "0.1.346.0-17112a-alpha"] \
  [org.clojure/test.check "0.5.9"] \
  [prismatic/schema "0.2.6"] \
  [instaparse "1.3.4"] \
  [org.clojure/core.logic "0.8.8"] \
  [org.clojure/core.match "0.2.1"] \
  [prismatic/plumbing "0.3.3"] \
  [slingshot "0.11.0"] \
  [compojure "1.1.9"] \
  [clj-http "1.0.0"] \
  [enlive "1.1.5"] \
  [hiccup "1.0.5"] \
  [junit/junit "4.11"] \
  [org.codehaus.groovy/groovy-all "2.3.6"] \
  [environ "0.5.0"] \
] \
:plugins [ \
  [lein-exec "0.3.4"] \ 
  [lein-environ "0.5.0"] \
]}}' > ~/.lein/profiles.clj
RUN LEIN_ROOT=true lein exec -e '(prn :ok)'

# Install scala
RUN apt-get install -y scala
RUN curl http://downloads.typesafe.com/scala/2.11.2/scala-2.11.2.deb > /tmp/scala-2.11.2.deb
RUN dpkg -i /tmp/scala-2.11.2.deb && rm /tmp/scala-2.11.2.deb
