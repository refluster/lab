#!/usr/bin/env python

import string
import sys
import os

class ShowHtml:
    Command = "sed 's/</\\&lt;/g;s/>/\\&gt;/g' "
    BufSize = 256

    def __init__(self):
        1 == 1
        
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
        sys.stdout.write("<h2>code</h2><pre>")
        sys.stdout.write("</pre></body></html>")
        
if __name__ == "__main__":
    ShowHtml().page()
