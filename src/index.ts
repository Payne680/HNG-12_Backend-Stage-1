import express, { Request, Response, RequestHandler } from "express";
import fetch from "node-fetch";

const app = express();
const PORT = 3000;

// Function to check if a number is prime
const isPrime = (num: number): boolean => {
    if (num < 2) return false;
    for (let i = 2; i * i <= num; i++) {
        if (num % i === 0) return false;
    }
    return true;
};

// Function to check if a number is perfect
const isPerfect = (num: number): boolean => {
    let sum = 1;
    for (let i = 2; i * i <= num; i++) {
        if (num % i === 0) {
            sum += i;
            if (i !== num / i) sum += num / i;
        }
    }
    return sum === num && num !== 1;
};

// Function to check if a number is an Armstrong number
const isArmstrong = (num: number): boolean => {
    const digits = num.toString().split('').map(Number);
    const power = digits.length;
    const sum = digits.reduce((acc, d) => acc + Math.pow(d, power), 0);
    return sum === num;
};

// Function to get sum of digits
const digitSum = (num: number): number => {
    return num.toString().split('').reduce((acc, d) => acc + Number(d), 0);
};

// Function to fetch a fun fact from Numbers API using fetch
const getFunFact = async (num: number): Promise<string> => {
    try {
        const response = await fetch(`http://numbersapi.com/${num}`);
        return await response.text();
    } catch (error) {
        return `Could not fetch a fun fact for ${num}.`;
    }
};

const classifyNumberHandler: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { number } = req.query;
    const num = Number(number);

    if (isNaN(num) || !Number.isInteger(num)) {
        res.status(400).json({ number, error: true });
        return;
    }

    const properties: string[] = [];
    if (num % 2 !== 0) properties.push("odd");
    if (num % 2 === 0) properties.push("even");
    if (isArmstrong(num)) properties.push("armstrong");

    const funFact = await getFunFact(num);

    res.json({
        number: num,
        is_prime: isPrime(num),
        is_perfect: isPerfect(num),
        properties,
        digit_sum: digitSum(num),
        fun_fact: funFact,
    });
};

app.get("/api/classify-number", classifyNumberHandler);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
