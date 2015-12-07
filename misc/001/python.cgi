#!/usr/bin/env python

import string
import sys
import os

class Counter:
    FileName = './count-data.txt'

    def __init__(self):
        if os.path.exists(Counter.FileName):
            f = open(Counter.FileName, 'r')
            self.count = string.atoi(f.read()) + 1
            f.close()
        else:
            self.count = 1

    def get_count(self):
        return self.count
		
    def update(self):
        f = open(Counter.FileName, 'w')
        f.write(str(self.count))
        f.close()

class ShowHtml:
    Command = "sed 's/</\\&lt;/g;s/>/\\&gt;/g' "
    BufSize = 256

    def __init__(self):
        self.counter = Counter()
        
    def insert_file(self, fname):
        p_stdin, p_stdout = os.popen2(self.Command + fname)
        
        buf = p_stdout.read(self.BufSize)
        while buf:
            sys.stdout.write(buf)
            buf = p_stdout.read(self.BufSize)

    def page(self):
        sys.stdout.write(
            "Content-type: text/html\n\n<html><head>" +
            "<link rel=\"stylesheet\" type=\"text/css\" href=\"style.css\">" +
            '</head><body><h1>CGI - Python</h1><h2>counter</h2>')
        s = "access count : " + str(self.counter.get_count())
        sys.stdout.write(s)
        self.counter.update()
        sys.stdout.write("<h2>code</h2><pre>")
        self.insert_file(__file__)
        sys.stdout.write("</pre></body></html>")
        
if __name__ == "__main__":
    ShowHtml().page()
