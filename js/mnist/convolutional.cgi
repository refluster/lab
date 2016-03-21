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
        
        x = tf.placeholder(tf.float32, shape=[None, 784])
        sess = tf.InteractiveSession()
        
        def weight_variable(shape):
            initial = tf.truncated_normal(shape, stddev=0.1)
            return tf.Variable(initial)

        def bias_variable(shape):
            initial = tf.constant(0.1, shape=shape)
            return tf.Variable(initial)

        def conv2d(x, W):
            return tf.nn.conv2d(x, W, strides=[1, 1, 1, 1], padding='SAME')

        def max_pool_2x2(x):
            return tf.nn.max_pool(x, ksize=[1, 2, 2, 1],
                                  strides=[1, 2, 2, 1], padding='SAME')

        W_conv1 = weight_variable([5, 5, 1, 32])
        b_conv1 = bias_variable([32])

        x_image = tf.reshape(x, [-1,28,28,1])

        h_conv1 = tf.nn.relu(conv2d(x_image, W_conv1) + b_conv1)
        h_pool1 = max_pool_2x2(h_conv1)

        W_conv2 = weight_variable([5, 5, 32, 64])
        b_conv2 = bias_variable([64])

        h_conv2 = tf.nn.relu(conv2d(h_pool1, W_conv2) + b_conv2)
        h_pool2 = max_pool_2x2(h_conv2)

        W_fc1 = weight_variable([7 * 7 * 64, 1024])
        b_fc1 = bias_variable([1024])

        h_pool2_flat = tf.reshape(h_pool2, [-1, 7*7*64])
        h_fc1 = tf.nn.relu(tf.matmul(h_pool2_flat, W_fc1) + b_fc1)

        keep_prob = tf.placeholder(tf.float32)
        h_fc1_drop = tf.nn.dropout(h_fc1, keep_prob)

        W_fc2 = weight_variable([1024, 10])
        b_fc2 = bias_variable([10])

        y_conv=tf.nn.softmax(tf.matmul(h_fc1_drop, W_fc2) + b_fc2)

        saver = tf.train.Saver()
        sess = tf.Session()

        init = tf.initialize_all_variables()
        sess.run(init)

        saver.restore(sess, "./convolutional.ckpt")
        result = sess.run(y_conv, feed_dict={x: data, keep_prob: 1.0})

        sys.stdout.write("Content-type: application/json\n\n");

        sys.stdout.write('[');
        for i in range(9):
            sys.stdout.write("%.02f" % (result[0][i]));
            sys.stdout.write(',');
        sys.stdout.write("%.02f" % (result[0][9]));
        sys.stdout.write(']');

#        pp.pprint(result);
#        pp.pprint(data);

if __name__ == "__main__":
    ShowHtml().page()
