#!/usr/bin/env gosh

(use gauche.process)

(define-constant filename "./count-data.txt")
(define-constant read-block-size 64)

(define (get-count)
  (if (file-exists? filename)
      (let* ((iport (open-input-file filename))
	     (count (string->number (read-line iport))))
	(close-input-port iport) (+ 1 count))
      1))

(define (update-count count)
  (let ((oport (open-output-file filename)))
    (display count oport)
    (close-output-port oport)))

(define (show-file file)
  (receive (port process) (open-input-process-port
			   (list 'sed "s/</\\&lt;/g;s/>/\\&gt;/g"
				 (sys-basename *program-name*)))
	   (let ((buf #f))
	     (until (eof-object? (set! buf (read-line port)))
		    (print buf)
		    (process-wait process)))))

(define (show-html)
  (print "Content-type: text/html\n\n<html><head>"
	 "<link rel=\"stylesheet\" type=\"text/css\" href=\"style.css\">"
	 "</head><body><h1>CGI - Lisp (gauche)</h1>"
	 "<h2>counter</h2>")
  (let ((count (get-count)))
    (print "access count : " count)
    (update-count count))
  (print "<h2>code</h2><pre>")
  (show-file *program-name*)
  (print "</pre></body></html>"))

(show-html)
