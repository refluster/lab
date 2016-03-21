#!/usr/bin/env python

import string
import sys
import os
import json
#import input_data
import tensorflow as tf
import numpy as np

import pprint

#mnist = input_data.read_data_sets("MNIST_data/", one_hot=True)

pp = pprint.PrettyPrinter(depth=6)

class ShowHtml:
    def __init__(self):
        1 == 1
        
    def page(self):
        data = json.load(sys.stdin);
        for i in range(len(data[0])):
            data[0][i] = (255 - data[0][i])/255.0

        ##############################
        x = tf.placeholder(tf.float32, [1, 784])
        W = tf.Variable(tf.zeros([784, 10]))
        b = tf.Variable(tf.zeros([10]))
        y = tf.nn.softmax(tf.matmul(x, W) + b)

        saver = tf.train.Saver()
        sess = tf.Session()

        init = tf.initialize_all_variables()
        sess.run(init)

        saver.restore(sess, "./model.ckpt")
        result = sess.run(y, feed_dict={x: data})

        sys.stdout.write("Content-type: application/json\n\n");

        sys.stdout.write('[');
        for i in range(9):
            sys.stdout.write("%.03f" % (result[0][i]));
            sys.stdout.write(',');
        sys.stdout.write("%.03f" % (result[0][9]));
        sys.stdout.write(']');
        
#        pp.pprint(result);
#        pp.pprint(data);

if __name__ == "__main__":
    ShowHtml().page()
