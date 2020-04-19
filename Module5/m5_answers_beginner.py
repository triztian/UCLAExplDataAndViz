#!/usr/bin/env python3
"""Answers to the Beginner To Moderate Module5 excercises"""
__author__ = 'Tristian Azuara'

#E1
# Declare a variable (i.e. something that stores a value) and initialize it 
# (i.e. set something to that variable)
x = 42
a = 'Something'

#E2
# Change the value of that variable (i.e. change what was initialized before), 
# go ahead and try to reset/declare, that variable a few times, check the 
# variable type, (use type function, i.e. is it int, string, etc.)
# Note: Run each variable declaration separately
x = 99
print(type(x))

x = 'Converted to string'
print(type(x))

#E3
# Global and local variables in functions (just run this and be able to describe
# the differencein variable states (i.e. one variable declaration ONLY exists 
# in the function and the other) outside that function.


# Declares and prints the "foobar" value that was assigned to `someOtherVariable`
# the "foobar" value will only be present inside the scope of the `someFunction`
def someFunction():
  someOtherVariable = "foobar" 
  print(someOtherVariable)

# Print the someOtherVariable value
someFunction()

# Attempt to print the value but a `NameError` will be raised because 
# `someOtherVariable` was not declared in the "global" scope.
print(someOtherVariable) 

someVariable = 99
del someVariable

# Attempt to print the value for `someVariable`, however a `NameError` will be
# raised because the variable was deleted from the scope, the `del` 
# this is different operator is different from setting the variable to `None`.
print(someVariable)

#E4 
# Pass function to a function

# 1) Using definitions
def callback():
    print('called by func')

def invoke(code):
    code()

invoke(callback)

# 2) As a lambda
invoke(lambda: print('called by func'))

#E5
#Now delete all the variables we made
del x
del a

#**********************
# Conditionals Python
#**********************

#E6
# Write a conditional in Python

if True:
    print('Found!')

if False:
    # this line will never be executed because the condition is never met
    print('a lie')

# Expression must evaluate to the bool(True) in order for the block of 
# code to execute.
x = 42
if x == 42: print('The answer')

#**********************
# Functions Python
#**********************

#E7
# Create a function (i.e. takes inputs, outputs, in this case a function 
# with NO arguments, # NO return values)
def noop():
    pass

#E8
# Create a function (i.e. takes inputs, outputs, in this case a function with arguments)
# NO return values)
def my_print(x):
    print(x)

#E9
# Create a function (i.e. takes inputs, outputs, in this case a function with arguments)
# return values)
def multiply(x, n):
    return x * n

#E10
### Advanced
# Create a function (i.e. takes inputs, outputs, in this case a function with arguments)
# return values, has DEFAULT values and VARIABLE number of arguments)
def max_func(x=42, b=1, **kwargs):
    print()
    return x * b

#**********************
# Loops in Python
#**********************

#E11
# Create a while loop

# Loops forerver
while True:
    print('forever')

# Loops until x is less than 10
x = 0
while x < 10:
    x += 1
    print(x)
  
#E12
# Create a for loop
numbers = [1, 3, 4]
for x in numbers:
    print(x)

#E13
### Advanced
# loop over a collection, use the enumerate() function to get index, and break and continue (generally)
# don't want to 'break' out of loops
numbers = [100, 200, 300]
for i, n in enumerate(numbers):
    print(i, n)
  
### Advanced
#**********************
# Clases in Python
#**********************

#E14
# Declare 2 classes, and instantiate (declare one of each), and manipulate 
#  their variables Classes are the basis as a framework for object oriented 
# programming

class Person():
    def __init__(self, name, age):
        self.name = name
        self.age = age

class Currency():
    def __init__(self, symbol, amount):
        self.symbol = symbol
        self.amount = amount

john_doe = Person('John', 35)
john_doe.name = 'John Doe'

almost_million = Currency(symbol='$', amount=999_999.99)
almost_million.amount = 1_000_000.00
