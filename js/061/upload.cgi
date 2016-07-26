#!/usr/bin/ruby --

require 'cgi'

def getFileName(baseFname)
  dir = "upload/"
  return dir + baseFname
end

def main()
  print "Content-type: text/html\n\n"
  cgi = CGI.new
  file = getFileName('file.txt')
  p File.write(file, cgi.params['data'][0])
end

main
