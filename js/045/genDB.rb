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
    row = [sprintf("\"fileOrig\":\"build%03d.jpg\"", i),
           sprintf("\"fileLarge\":\"build%03d.jpg\"", i),
           sprintf("\"fileThumb\":\"build%03d-80.jpg\"", i),
           sprintf("\"date\":\"%s\"", "2015-08-12")]
    rows.push "{" + row.join(',') + "}"
  end

  for i in 0..10 do
    row = [sprintf("\"fileOrig\":\"drink%03d.jpg\"", i),
           sprintf("\"fileLarge\":\"drink%03d.jpg\"", i),
           sprintf("\"fileThumb\":\"drink%03d-80.jpg\"", i),
           sprintf("\"date\":\"%s\"", "2015-08-13")]
    rows.push "{" + row.join(',') + "}"
  end

  for i in 0..15 do
    row = [sprintf("\"fileOrig\":\"park%03d.jpg\"", i),
           sprintf("\"fileLarge\":\"park%03d.jpg\"", i),
           sprintf("\"fileThumb\":\"park%03d-80.jpg\"", i),
           sprintf("\"date\":\"%s\"", "2015-08-13")]
    rows.push "{" + row.join(',') + "}"
  end

  for i in 0..7 do
    row = [sprintf("\"fileOrig\":\"road%03d.jpg\"", i),
           sprintf("\"fileLarge\":\"road%03d.jpg\"", i),
           sprintf("\"fileThumb\":\"road%03d-80.jpg\"", i),
           sprintf("\"date\":\"%s\"", "2015-08-15")]
    rows.push "{" + row.join(',') + "}"
  end

  for i in 0..14 do
    row = [sprintf("\"fileOrig\":\"room%03d.jpg\"", i),
           sprintf("\"fileLarge\":\"room%03d.jpg\"", i),
           sprintf("\"fileThumb\":\"room%03d-80.jpg\"", i),
           sprintf("\"date\":\"%s\"", "2015-08-15")]
    rows.push "{" + row.join(',') + "}"
  end

  print "[" + rows.join(',') +  "]"
end

main
  
