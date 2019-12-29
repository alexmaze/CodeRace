package main

import (
	"fmt"
)

func main() {
	for _, c := range cases {
		if recognize(c.param) != c.expected {
			fmt.Printf("failed check %v %v\n", c.param, c.expected)
			break
		}
	}
}

func recognize(text string) bool {
	// TODO Your implimentation

	return false
}
