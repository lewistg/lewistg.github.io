---
layout: post
title:  "Logrithmic Exponentiation: SICP 1.16"
excerpt: Working my way through Structure and Interpretation of Computer Programs, I have decided to write about a few of the solutions to the exercises. Recently, I solved exercise 1.16, which tackles iterative exponentiation.
categories: general
---

The Structure and Intepretation of Programs (SICP) outlines a recursive
algorithm for raising some number to some positive integer power. The algorithm
serves as the text's prototypical example of algorithms running in logrithmic
time.  Following the dicussion surrounding the algorithm and its time complexity, the authors
pose the following problem (exercise 1.16):

>Design a procedure that evolves an iterative exponentation process that uses successive squaring and uses a logarithmic number of steps, as does fast-expt.  (Hint: Using the observation that \\((b^{n/2})^2 = (b^2)^{n/2}\\), keep, along with the exponent \\(n\\) and base \\(b\\), an additional state variable \\(a\\), and define the state transformation in such a way that the product \\(ab^n\\) is unchanged from state to state. At the beginning of the process \\(a\\) is taken to be 1, and the answer is given by the value of \\(a\\) at the end of the process. In general, the technique of defining an invariant quantity that remains unchanged from state to state is a powerful way of to think about the design of iterative algorithms.)


This post describes a possible solution to this exercise and delves into "loop invariants."


#What to make of the hints

#Loop invariants

As an example of logrithmic time complexity, The Structure and Intepretation of
Programs describes a simple recursive algorithm for exponentation. As a
follow-up exercise to the discussion, the authors ask readers to reimplement
the algorithm using iteration (exercise 1.16). This post describes some insight
behind one possible solution.

Exercise 1.16 states,

>Design a procedure that evolves an iterative exponentation process that uses successive squaring and uses a logarithmic number of steps, as does fast-expt.  (Hint: Using the observation that \\((b^{n/2})^2 = (b^2)^{n/2}\\), keep, along with the exponent \\(n\\) and base \\(b\\), an additional state variable \\(a\\), and define the state transformation in such a way that the product \\(ab^n\\) is unchanged from state to state. At the beginning of the process \\(a\\) is taken to be 1, and the answer is given by the value of \\(a\\) at the end of the process. In general, the technique of defining an invariant quantity that remains unchanged from state to state is a powerful way of to think about the design of iterative algorithms.)

The hint's first observation gives some intial ideas about how to iterate
towards the final answer. Not only does \\(b^n = (b^2)^{n/2}\\), but also

\\[b^n = (b^2)^{n/2} = (b^4)^{n/4} = (b^8)^{n/8} \\] 

or more generally

\\[b^n = (b^{2^i})^{n/2^i}\\]

We can easily extrapolate on this idea to

Obviously, the above routine is only useful for values \\(n\\) that are powers of \\(2\\). For the general case, the extra state variable \\(a\\) comes into play. Notice that if \\(n = 2m + 1\\), an odd number, then
\\[b^n = (b^2)^{(2m + 1)/2} = (b^2)^{1/2}(b^2)^{(2m + 1) / 2 - 1/2} = (b)(b^2)^{(2m)/2}\\]

Similarly,

\\[b^n = (b^4)^{(2m + 1) / 4} = (b^4)^{1/4}(b^4)^{(2m + 1)/4 - 1/4} = (b)(b^4)^{(2m)/4}\\]

\\[b^n = (b^8)^{(2m + 1) / 8} = (b)(b^8)^{(2m)/8}\\]

\\[b^n = (b^{16})^{(2m + 1) / 16} = (b)(b^{16})^{(2m)/16}\\]

These insights give us the following state transition rules

\\[
\begin{cases}
0 & 2 | n \\ 0 & 2 | n \!\!
\end{cases}
\\]

For \\(n\\) that is not a power of two

This problem is reminiscent of a

(define (exp-by-pwr-of-two b n)
	)

{% highlight lisp %}
(define (square x) (* x x))

(define (is-odd? x) (= (modulo x 2) 1))

(define (fast-expt b n)
	(define (fast-expt-iter a b-prime n-prime)
		(cond ((= n-prime 1) (* a b-prime))
			((is-odd? n-prime) (fast-expt-iter (* a b) (square b-prime) (floor (/ n-prime 2))))
			(else (fast-expt-iter a (square b-prime) (/ n-prime 2)))))
	(if (= n 0) 1 (fast-expt-iter 1 b n)))
{% endhighlight %}

\\((b^n)^{\frac{n}{2^{log_2(n)}}}\\)
