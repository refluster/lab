#!/usr/bin/ruby --

require 'date'
require 'json'

UPLOAD_DIR = 'upload'

class FilesList
  def initialize
    @files = Dir::entries(UPLOAD_DIR)
    @files.select! {|d| /^\d+\.csv$/ =~ d}
    @files.map! {|d| "#{UPLOAD_DIR}/#{d}"}

    @mtimes = @files.map {|d| File.mtime(d)}
  end    

  def list
    d = (0..(@files.length - 1)).collect {|i|
      {:file => @files[i], :time => @mtimes[i]}
    }

    print "Content-type: text/html\n\n"
    puts JSON.pretty_generate(d)
  end

  def remove
    now = DateTime.now

    @files.select! {|d|
      mtime = File.mtime(d)
      if mtime.year == now.year && mtime.month == now.month && mtime.day == now.day
        true
      else
		p d
        File.delete d
        false
      end
    }
  end
end

fl = FilesList.new
fl.remove
fl.list
