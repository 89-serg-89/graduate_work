export class CreateDto {
  readonly email: string
  public password: string
  readonly firstName: string
  readonly lastName: string
}

export class SignInDto {
  readonly email: string
  readonly password: string
}
