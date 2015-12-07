#!/usr/bin/env perl

use strict;
use warnings;
use File::Basename;

use constant filename => './count-data.txt';

# get_count()
sub get_count {
    my $count;
    if (-f filename) {
	open(my $fh, '<', filename) or die("cannot open ". filename);
	$count = <$fh> + 1;
	close($fh);
    } else {
	$count = 1;
    }
    return $count;
}

# update_count(count)
sub update_count {
    my ($count) = @_;
    open(my $fh, '>', filename) or die("cannot open ". filename);
    print $fh $count;
}

# show_file(script)
sub show_file {
    my ($script) = @_;
    system('sed \'s/</\\&lt;/g;s/>/\\&gt;/g\' '. $script)
}

sub show_html {
    my $count;
    my ($script, $dir) = fileparse($0);

    print "Content-type: text/html\n\n<html><head>".
	"<link rel=\"stylesheet\" type=\"text/css\" href=\"style.css\">".
	"</head><body><h1>CGI - perl</h1>".
	"<h2>counter</h2>";
    $count = &get_count;
    print "access count : $count";
    &update_count($count);
    print "<h2>code</h2><pre>";
    &show_file($script);
    print "</pre></body></html>";
}

&show_html;
