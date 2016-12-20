#!/bin/sh

ymd=`date '+%Y%m%d' -d '30 minute ago'`
md=`date '+%m/%d' -d '30 minute ago'`
fname=`dirname $0`/$ymd.dat

wget "http://api.p2pquake.net/userquake?date=${md}" -O $fname
nkf -w --overwrite $fname
