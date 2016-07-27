#!/usr/bin/ruby --

require 'cgi'
require 'date'

def getFileName(baseFname)
  dir = "upload/"
  return dir + baseFname
end

def main()
  print "Content-type: text/html\n\n"
  cgi = CGI.new

  d = DateTime.now
  file = getFileName(d.strftime("%Y%m%d%H%M%S") + '.csv')
  p file
  File.write(file, cgi.params['data'][0])
end

main
