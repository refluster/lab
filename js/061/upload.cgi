#!/usr/bin/ruby --

require 'cgi'

def getFileName(baseFname)
  dir = "upload/"
  fname = dir + baseFname

  if File.exist?(fname)
    ext = File.extname(fname)
    name = fname[0, fname.length - ext.length]
    
    for n in 0..1000 do
      fname = "#{name} (#{n})#{ext}"
      break if ! File.exist?(fname)
    end
  end

  return fname
end

def main()
  print "Content-type: text/html\n\n"
  cgi = CGI.new
  file = getFileName('file.txt')
  p File.write(file, cgi.params['data'][0])
end

main
