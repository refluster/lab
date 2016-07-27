#!/usr/bin/ruby --

require 'json'

UPLOAD_DIR = 'upload'

class FilesList
  def initialize
    @files = Dir::entries(UPLOAD_DIR)
    @files.select! {|d| /^\d+\.csv$/ =~ d}
    @files.map! {|d| "#{UPLOAD_DIR}/#{d}"}

    @mtimes = @files.map {|d| File.mtime(d)}
  end    

  def main
    d = (0..(@files.length - 1)).collect {|i|
      {:file => @files[i], :time => @mtimes[i]}
    }

    print "Content-type: text/html\n\n"
    puts JSON.pretty_generate(d)
  end
end

FilesList.new.main
