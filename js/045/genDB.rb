#!/usr/bin/env ruby

=begin
		this.list = {
			'2015/08/12': [],
			'2015/08/13': [],
			'2015/08/10': [],
			'2015/08/18': [],
		};
		
		for (var i = 0; i <= 6; i++) {
			this.list['2015/08/12'].push({fileOrig: 'build' + pad(i, 3) + '.jpg',
										  fileLarge: 'build' + pad(i, 3) + '.jpg',
										  fileThumb: 'build' + pad(i, 3) + '-80.jpg'});
		}
		for (var i = 0; i <= 10; i++) {
			this.list['2015/08/13'].push({fileOrig: 'drink' + pad(i, 3) + '.jpg',
										  fileLarge: 'drink' + pad(i, 3) + '.jpg',
										  fileThumb: 'drink' + pad(i, 3) + '-80.jpg'});
		}
		for (var i = 0; i <= 15; i++) {
			this.list['2015/08/13'].push({fileOrig: 'park' + pad(i, 3) + '.jpg',
										  fileLarge: 'park' + pad(i, 3) + '.jpg',
										  fileThumb: 'park' + pad(i, 3) + '-80.jpg'});
		}
=end

def main()
  rows = []

  for i in 0..6 do
    row = [sprintf("\"fileOrig\":\"img/build%03d.jpg\"", i),
           sprintf("\"fileLarge\":\"img/build%03d.jpg\"", i),
           sprintf("\"fileThumb\":\"img/build%03d-80.jpg\"", i),
           sprintf("\"date\":\"%s\"", "2015-08-12")]
    rows.push "{" + row.join(',') + "}"
  end

  for i in 0..10 do
    row = [sprintf("\"fileOrig\":\"img/drink%03d.jpg\"", i),
           sprintf("\"fileLarge\":\"img/drink%03d.jpg\"", i),
           sprintf("\"fileThumb\":\"img/drink%03d-80.jpg\"", i),
           sprintf("\"date\":\"%s\"", "2015-08-13")]
    rows.push "{" + row.join(',') + "}"
  end

  for i in 0..15 do
    row = [sprintf("\"fileOrig\":\"img/park%03d.jpg\"", i),
           sprintf("\"fileLarge\":\"img/park%03d.jpg\"", i),
           sprintf("\"fileThumb\":\"img/park%03d-80.jpg\"", i),
           sprintf("\"date\":\"%s\"", "2015-08-13")]
    rows.push "{" + row.join(',') + "}"
  end

  for i in 0..7 do
    row = [sprintf("\"fileOrig\":\"img/road%03d.jpg\"", i),
           sprintf("\"fileLarge\":\"img/road%03d.jpg\"", i),
           sprintf("\"fileThumb\":\"img/road%03d-80.jpg\"", i),
           sprintf("\"date\":\"%s\"", "2015-08-15")]
    rows.push "{" + row.join(',') + "}"
  end

  for i in 0..14 do
    row = [sprintf("\"fileOrig\":\"img/room%03d.jpg\"", i),
           sprintf("\"fileLarge\":\"img/room%03d.jpg\"", i),
           sprintf("\"fileThumb\":\"img/room%03d-80.jpg\"", i),
           sprintf("\"date\":\"%s\"", "2015-08-15")]
    rows.push "{" + row.join(',') + "}"
  end

  print "[" + rows.join(',') +  "]"
end

main
  
