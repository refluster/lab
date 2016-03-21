#!/usr/bin/env python

import string
import sys
import os
import json

import pprint

pp = pprint.PrettyPrinter(depth=6)

class ShowHtml:
    def __init__(self):
        1 == 1
        
    def page(self):
        data = json.load(sys.stdin);
        
        for i in range(len(data)):
            data[i] = data[i]/255.0

        sys.stdout.write("Content-type: application/json\n\n");
        pp.pprint(data)
        
        
if __name__ == "__main__":
    ShowHtml().page()
