require 'webrick'
srv = WEBrick::HTTPServer.new({:DocumentRoot => './',
                               :BindAddress => '192.168.13.67',
                               :Port => 80})
# srv.mount('/hoge.pl', WEBrick::HTTPServlet::CGIHandler, 'really_executed_script.rb')
Signal.trap(:INT){ srv.shutdown }
srv.start
