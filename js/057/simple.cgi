#!/usr/bin/env python

import sys
import json
import tensorflow as tf

def main():
    # read input data
    data = json.load(sys.stdin);
    for i in range(len(data[0])):
        data[0][i] = (255 - data[0][i])/255.0

    # create placeholder
    x = tf.placeholder(tf.float32, [1, 784])

    # create variables
    W = tf.Variable(tf.zeros([784, 10]))
    b = tf.Variable(tf.zeros([10]))

    # create network
    y = tf.nn.softmax(tf.matmul(x, W) + b)

    # create session
    sess = tf.Session()

    # restore sessiion
    saver = tf.train.Saver()
    saver.restore(sess, "./simple.ckpt")

    # predict
    result = sess.run(y, feed_dict={x: data})

    # return result
    sys.stdout.write("Content-type: application/json\n\n");
    sys.stdout.write('[');
    for i in range(9):
        sys.stdout.write("%.02f" % (result[0][i]));
        sys.stdout.write(',');
    sys.stdout.write("%.02f" % (result[0][9]));
    sys.stdout.write(']');
        
main()
