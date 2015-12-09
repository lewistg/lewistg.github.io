---
layout: post
title:  "Logrithmic Exponentiation: SICP 1.16"
excerpt: Working my way through Structure and Interpretation of Computer Programs, I have decided to write about a few of the solutions to the exercises. Recently, I solved exercise 1.16, which tackles iterative exponentiation.
categories: general
---

Structure and Intepretation of Programs (SICP) takes readers through a
disucssion on time complexity using algorithms that calculate exponents. The discussion
develops some algorithmic insights that eventually lead to the
development of a recursive exponentation algorithm running in logrithmic time.
As an exercise, the author's ask readers to write an equivalent algorithm that
runs iteratively. This post describes a possible solution.

#The problem

The actual wording of the exercise (1.16) is  the following:

>Design a procedure that evolves an iterative exponentation process that uses successive squaring and uses a logarithmic number of steps, as does fast-expt.  (Hint: Using the observation that \\((b^{n/2})^2 = (b^2)^{n/2}\\), keep, along with the exponent \\(n\\) and base \\(b\\), an additional state variable \\(a\\), and define the state transformation in such a way that the product \\(ab^n\\) is unchanged from state to state. At the beginning of the process \\(a\\) is taken to be 1, and the answer is given by the value of \\(a\\) at the end of the process. In general, the technique of defining an invariant quantity that remains unchanged from state to state is a powerful way of to think about the design of iterative algorithms.)

(Just by way of background, the algorithm fast-expt is the text's name for the
recursive algorithm mentioned in the introduction.)

This algorithm is restricted to

#Solution sketch

Not only does $b^n = (b^2)^{n/2}$ but more generally
$$b^n = (b^2)^{n/2} = (b^4)^{n/4} = (b^8)^{n/8} = (b^{16})^{n/16} = \cdots =
(b^{2^i})^{n/2^i} = \cdots$$ The pattern in this chain of equalities, moving
left to right, can be captured in code using a loop and two state variables we call 
$b$ and $n$. We let $b$ represent the quantity in the parentheses, and we let
$n$ represent the exponent quantity. The loop's state transition rules would be the
following:
$$b \leftarrow b^2$$
$$n \leftarrow n / 2$$
Iteration terminates once the exponent value $n$ is completely reduced to 1, in which case
the base value $b$ is our answer.

While the state transition rules given above faithfully capture the pattern in
our chain of inequalities, they do not address what to do with odd values of
$n$. To explore, let us say that $n$ is $2m + 1$, an odd number. Notice that
$$b^{2m+1} = (b)(b)^{2m}$$ Thus, one strategy we could adopt for odd exponents
is factoring out a $b$ in order to obtain an even exponent value that can be
halved. This would
require keeping track of each factor that is factored out throughout the loop's
iterations and then multiplying the final base value by these extra factors at
the end. Where do we keep track of these extra factors? Recall that the problem
statement allows for an extra state variable $a$; we can use $a$ as a
running product of factored out factors.

Given our strategy for odd exponents, our state transition rules now become a more sophisticated:
$$b \leftarrow b^2$$
$$n \leftarrow
\begin{cases}
n / 2 & \text{if } n|2 \\\\
(n - 1)/2 & \text{if } n \nmid 2
\end{cases}$$
$$a \leftarrow
\begin{cases}
a & \text{if } n|2 \\\\
ab & \text{if } n \nmid 2
\end{cases}$$

##Example

As an example, let us say we are calculating $5^7$. The following table shows the state variables after each iteration:

<table style="border: 1px solid black;">
	<tr>
		<td>Iteration</td><td>State Variables</td><td>Transition</td>
	</tr>
	<tr>
		<td>0</td><td>$b = 5$, $n = 7$, $a = 1$</td>
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
		<td>2</td><td>$b = 625$, $n = 1$, $a = 125$</td>
		<td>
			<p>$b: 625 \leftarrow 25^2$</p>
			<p>$n: 3 \leftarrow (7 - 1)/2$</p>
			<p>$a: 5 \leftarrow (5)(1)$</p>
		</td>
	</tr>
</table>

we need a more sophisticated state transition rule for $n$.

The
"state transition" rules for the suggested algorithm would be
$$b\_{i + 1} = b\_{i}^2$$
$$n\_{i + 1} = n\_{i}/2$$
where $b\_i$ and $n\_i$ are, respectively, the base
and exponent values for the $i$th iteration, and the code may look something
like the following:


As you might have surmized, this algorithm fails when $n$ is not a power of 2; any other power has an odd prime factor. We need a more sophisticated 

Let us restrict ourselves for a moment to exponent values $n = 2^k$ where $k$
(i.e., $n$ is always a power of 2). Under this condition, the algorithm need
only iterate through the terms in the above chain of equalities. It could do so
using the following "state transition" rules  where $b\_i$ and $n\_i$ are,
respectively, the base and exponent values for the $i$th iteration:
$$b\_{i + 1} = b\_{i}^2$$
$$n\_{i + 1} = n\_{i}/2$$ The algorithm would halt when the state variable
$n\_i = 1$, in which case $b\_i$ would contain the answer. For example, the
following table shows the state transition variables for calculating $5^8$ along with the
the term from our chain of equalities that corresponds to those state variables.

| State variables | Corresponding term|
------------- | -------------
|$b\_0 = 5$, $n\_0 = 8$  | $(5)^8$ |
|$b\_1 = 25$, $n\_1 = 4$  | $(5^2)^{8/2}$ |
|$b\_2 = 625$, $n\_2 = 2$  | $(5^4)^{8/4}$ |
|$b\_3 = 390625$, $n\_3 = 1$  | $(5^8)^{8/8}$ |

As it turns out, with a little bit of modification, the algorithm we have
described so far can be used for values $n$ that are not powers of 2. Let us
say for example, we are given some power $n$, and after $k$ iterations, the state
variable $n\_k$ is equal to $2m + 1$, an odd number. Notice that
$$b\_k^{n\_k} = b\_k^{2m + 1} = b\_kb\_k^{2m}$$
By factoring out a $b\_k$, we obtained an exponent value, $2m$, that could once
again be halved to generate $n\_{k + 1}$. Moving to the next state, we must
keep track of the extra factor $b\_k$ that was pulled out.

The only problem we face is where to
keep track of this extra factor $b\_k$.


Notice that
$(b^2)^{n/2} = ((b^2)^2)^{n/4} = (((b^2)^2)^2)^{n/8}$; we could create an
algorithm that programatically extends this chain of equalities by iteratively
squaring the last squared value and halving the last exponent until,
eventually, the exponent is reduced to 1.  This naive description, of course,
does not account for odd values of $n$ (or any value of $n$ that is not a power
of 2 for that matter). Despite this issue, the approach sounds like a good
place to start. To give us something concrete to work with, let us define the
"state transition" rules we have described so far for our algorithm:
$$b\_{i + 1} = b\_{i}^2$$
$$n\_{i + 1} = n\_{i}/2$$
Note here that the notation $x\_i$ denotes the value of the state variable $x$
on $i$th iteration in our algorithm.

Let us try to account for odd values of $n\_i$. After $k$
iterations of squaring and halving, let us say the exponent $n\_k$ is the odd number \\(2m + 1\\) with $m > 0$. Note that
$$b\_k^{n\_k} = b\_k^{2m + 1} = b\_kb\_k^{2m} = b\_k(b\_k^2)^\frac{2m}{2}$$
The insight here is that we can obtain an even exponent by factoring out a
$b\_k$.  If we can just keep track of the fact that we factored out a $b\_k$
during this iteration then we can keep up the squaring and halving process. We
would also need to keep track of any other factors we end up factoring during
future iterations. Then, if it took us $j$ iterations for our exponent value to
be 1, then we could multiply our final value $b\_j$ by all of these extra
factors to get the final answer.

Luckily, the problem statement allows us to keep an extra state variable $a$.
We can "store" these extra factors from iteration to iteration by making $a$ a
running product of all the factors we end up factoring out. This approach gives
us the following more sophisticated transition rule for $n\_i$ and the
additional state variable $a$:

$$n\_{i+1} =
\begin{cases}
\frac{n\_i}{2} & \text{if } n\_i|2 \\\\
\frac{n\_i - 1}{2} & \text{if } n\_i \nmid 2
\end{cases}
$$

$$ a\_{i+1} =
\begin{cases}
a\_i & \text{if } n\_{i}|2 \\\\
a\_ib\_i & \text{if } n\_{i} \nmid 2\\\\
\end{cases}$$

#The code

With the state transition rules in place, the implementation is straightforward:

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

# Relation to converting numbers to binary

In college, I learned the following algorithm for converting a number to
binary. This problem actually sheds some insight into why this works.

For example, $b\_k = b\_0^{2^k}$

The process we take to reduce the value $n$ to 1 by continually dividing by 2
bears strong resemblence to the process of converting numbers to binary.
