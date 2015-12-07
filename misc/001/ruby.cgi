#!/usr/bin/env ruby

class Counter
  Filename = './count-data.txt'

  def initialize
    if FileTest.exists? Filename
      File::open(Filename) {|f|
        @count = f.gets.to_i + 1
      }
    else
      @count = 1
    end
  end

  def get
    @count
  end
  
  def update
    File::open(Filename,"w") {|f|
      f.print @count
    }
  end
end

class ShowHtml
  def initialize
    @counter = Counter.new
  end
  
  def insertFile(fname)
    IO.popen("sed 's/</\\&lt;/g;s/>/\\&gt;/g' #{fname}") {|p|
      while l = p.gets do
        print l
      end
    }
  end

  def page
    puts "Content-type: text/html\n\n<html><head>" + 
      "<link rel=\"stylesheet\" type=\"text/css\" href=\"style.css\">" +
      '</head><body><h1>CGI - Ruby</h1><h2>counter</h2>'
    
    puts "access count : #{@counter.get}"
    @counter.update
    
    puts "<h2>code</h2><pre>"
    insertFile (File.basename $0)
    puts "</pre></body></html>"
  end
end

ShowHtml.new.page
