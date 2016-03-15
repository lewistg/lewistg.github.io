---
layout: post
title:  "Logrithmic Exponentiation: SICP 1.16"
excerpt: Working my way through Structure and Interpretation of Computer Programs, I have decided to write about a few of the solutions to the exercises. Recently, I solved exercise 1.16, which tackles iterative exponentiation.
categories: general
---

Structure and Intepretation of Programs (SICP) explains logrithmic time
complexity with an exponent calculation algorithm. The authors ask
readers to reimplement the algorithm using iteration, and this post describes a
possible solution.

#The problem

The exercise (1.16) is  the following:

>Design a procedure that evolves an iterative exponentation process that uses successive squaring and uses a logarithmic number of steps, as does fast-expt.  (Hint: Using the observation that \\((b^{n/2})^2 = (b^2)^{n/2}\\), keep, along with the exponent \\(n\\) and base \\(b\\), an additional state variable \\(a\\), and define the state transformation in such a way that the product \\(ab^n\\) is unchanged from state to state. At the beginning of the process \\(a\\) is taken to be 1, and the answer is given by the value of \\(a\\) at the end of the process. In general, the technique of defining an invariant quantity that remains unchanged from state to state is a powerful way of to think about the design of iterative algorithms.)

(Just by way of background, the algorithm fast-expt is the text's name for the
recursive algorithm mentioned in the introduction.)

This algorithm is restricted to

# The solution

Not only does $b^n = (b^2)^{n/2}$ but more generally
$$b^n = (b^2)^{n/2} = (b^4)^{n/4} = (b^8)^{n/8} = (b^{16})^{n/16} = \cdots =
(b^{2^i})^{n/2^i} = \cdots$$
The left to right pattern in this chain of equalities suggest the following naive solution:
{% highlight lisp %}
(define (naive-fast-exp b n)
  (if (= n 1)
      b
      (naive-fast-exp (square b) (/ n 2))))
{% endhighlight %}
This naive solution has several shortcomings, the most obvious being it assumes
the exponent is always divisible by 2. Nevertheless, this procedure exhibits
the qualities we are looking for in our solution: It is iterative and uses the
successive squaring strategy. Let us try to improve upon it to handle odd
exponents as
well.

When $n$ is some odd number $2m + 1$, then note $b^{2m+1} = bb^{2m}$. Thus, whenever the exponent is odd, we can
factor out a $b$ to make the power even again for the next iteration. Of
course, we do not want to lose these factored out factors, so we keep track of
them from iteration to iteration using the extra state variable $a$, which is
allowed by the problem statement. When the exponent value is reduced to 1, and
therefore the loop is ready to terminate, we multiply the final value $b$ by
the extra factors stored in $a$ to obtain our final answer. Let us clarify with
the actual code:

{% highlight lisp %}
(define (is-odd? x)
  (= (modulo x 2) 1))

(define (fast-exp b n)
  (define (fast-exp-iter b n a)
    (if (= n 1)
        (* a b)
        (fast-exp-iter (square b) (floor (/ n 2)) (if (is-odd? n) (* a b) a))))
  (if (= n 0) 1 (fast-exp-iter b n 1)))
{% endhighlight %}

# Relationship to binary number representation

Although not immediately obvious, this algorithm has a strong relationship to the exponent's binary representation.

{% highlight lisp %}
(define (is-odd? x)
  (= (modulo x 2) 1))

(define (display-and-identity x f) (display x) (newline) f)

(define (fast-exp b n)
  (define (fast-exp-iter b n a)
    (if (= n 1)
        (display-and-identity 1 (* a b))
        (fast-exp-iter(square b)(floor (/ n 2))
                      (if (is-odd? n)
                          (display-and-identity 1 (* a b))
                          (display-and-identity 0 a)))))
  (if (= n 0) 1 (fast-exp-iter b n 1)))
{% endhighlight %}

To see why this is, we need only look more closely at the value of the state
variables at each iteration. The following table traces the state variable
values for the expression 


##Example

As an example, let us say we are calculating $5^7$. The following table shows the state variables after each iteration:

<table class="center" cellpadding="5" style="width: 350px; margin-top: 20px; margin-bottom: 20px;">
	<thead>
	<tr>
		<td>Iteration</td><td>State variables</td><td>Transition</td>
	</tr>
	</thead>
	<tbody>
	<tr>
		<td>0</td>
		<td>
			<p>$b = 5$</p>
			<p>$n = 7$</p>
			<p>$a = 1$</p>
		</td>
		<td></td>
	</tr>
	<tr>
		<td>1</td>
		<td>
			<p>$b = 25$</p>
			<p>$n = 3$</p>
			<p>$a = 5$</p>
		</td>
		<td>
			<p>$b: 25 \leftarrow 5^2$</p>
			<p>$n: 3 \leftarrow (7 - 1)/2$</p>
			<p>$a: 5 \leftarrow (5)(1)$</p>
		</td>
	</tr>
	<tr>
		<td>2</td>
		<td>
			<p>$b = 625$</p>
			<p>$n = 1$</p>
			<p>$a = 125$</p>
		</td>
		<td>
			<p>$b: 625 \leftarrow 25^2$</p>
			<p>$n: 3 \leftarrow (7 - 1)/2$</p>
			<p>$a: 5 \leftarrow (5)(1)$</p>
		</td>
	</tr>
	</tbody>
</table>
