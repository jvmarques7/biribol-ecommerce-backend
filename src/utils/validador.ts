export function isValidCPF(cpf: string): boolean {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  
    let soma = 0;
    for (let i = 0; i < 9; i++) soma += +cpf[i] * (10 - i);
    let dig1 = (soma * 10) % 11;
    if (dig1 === 10 || dig1 === 11) dig1 = 0;
    if (dig1 !== +cpf[9]) return false;
  
    soma = 0;
    for (let i = 0; i < 10; i++) soma += +cpf[i] * (11 - i);
    let dig2 = (soma * 10) % 11;
    if (dig2 === 10 || dig2 === 11) dig2 = 0;
  
    return dig2 === +cpf[10];
  }

export function isValidCNPJ(cnpj: string) {
    cnpj = cnpj.replace(/[^\d]+/g, "")
  
    if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false
  
    const calc = (x: number[]) =>
      x
        .map((n, i) => +cnpj[i] * n)
        .reduce((a, b) => a + b, 0)
  
    const dig1 = calc([5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]) % 11
    const dig2 = calc([6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]) % 11
  
    return (
      +cnpj[12] === (dig1 < 2 ? 0 : 11 - dig1) &&
      +cnpj[13] === (dig2 < 2 ? 0 : 11 - dig2)
    )
  }
  
  