export class CustomErrors extends Error {
    statusCode: number;

    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;
    }
}


export class DatabaseError extends CustomErrors {
  id: string | number;  // ID de l'objet qui a causé l'erreur
  statusCode: number;
  code: string;

  constructor(id: string | number, code: string, statusCode: number = 404) {
    super(statusCode, "Impossible to find a unique tuple");
    this.name = this.constructor.name; // Donne un nom à l'erreur
    this.code = code;  // Code d'erreur personnalisé
    this.statusCode = statusCode; // Code HTTP par défaut pour les erreurs
    this.id = id;  // ID de l'objet qui a causé l'erreur
    Error.captureStackTrace(this, this.constructor);  // Capture la stack trace
  }
}


export class BadStateDataBase extends CustomErrors {
    idOne: string;
    idTwo: string;
    statusCode: number;


    constructor(idOne: string, idTwo: string, statusCode: number = 500) {
    super(statusCode, "Bad Database State between two users");
        this.name = this.constructor.name; // Donne un nom à l'erreur
        this.statusCode = statusCode; // Code HTTP par défaut pour les erreurs
        this.idOne = idOne;  // ID de l'objet qui a causé l'erreur
        this.idTwo = idTwo;
        Error.captureStackTrace(this, this.constructor);  // Capture la stack trace
  }
}



export class ImpossibleToParticipate extends CustomErrors {
    partyId: number;
    userId: string;

    constructor(statusCode: number, partyId: number, userId: string) {
        super(statusCode, "User Can not Participate");
            this.partyId = partyId;
            this.userId = userId;
            Error.captureStackTrace(this, this.constructor);  // Capture la stack trace
    }
}
export class UniqueAttributeAlreadyExists extends CustomErrors {
  constructor(statusCode: number, message:string) {
    super(statusCode, message);
    Error.captureStackTrace(this, this.constructor);  // Capture la stack trace
  }
}

export class InvalidCredentials extends CustomErrors {
  constructor(statusCode: number, message:string) {
    super(statusCode, message);
    Error.captureStackTrace(this, this.constructor);  // Capture la stack trace
  }
}