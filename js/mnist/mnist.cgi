#!/usr/bin/env python

import string
import sys
import os
import json

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
        data = sys.stdin.read();
        data = json.loads(data);
        sys.stdout.write("Content-type: application/json\n\n");
        sys.stdout.write(str(data[0]))
        
if __name__ == "__main__":
    ShowHtml().page()
