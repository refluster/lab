#!/bin/sh

readonly filename=./count-data.txt

# get_count
get_count() {
    if [ -e $filename ]; then
	count=`cat $filename`
	echo -n `expr $count \+ 1`
    else
	echo -n 1
    fi
}

# update_count [count]
update_count() {
    count=$1
    echo -n $count > $filename
}

# show_file
show_file() {
    sed 's/</\&lt;/g; s/>/\&gt;/g' `basename $0`
}

show_html() {
    count=`get_count`
    update_count $count
    echo -e "Content-type: text/html\n\n<html><head>"
    echo "<link rel=\"stylesheet\" type=\"text/css\" href=\"style.css\">"
    echo "</head><body><h1>CGI - Shell Script (Bourne Shell)</h1>" 
    echo "<h2>counter</h2>"
    echo "access count : $count"
    echo "<h2>code</h2><pre>"
    show_file
    echo "</pre></body></html>"
}

show_html
